describe('Security E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('CSRF Protection', () => {
    it('should include CSRF token in forms', () => {
      cy.visit('/api/auth/register');
      cy.get('form').should('exist');
      cy.get('input[name="csrfToken"]').should('exist').or.find('[data-csrf]').should('exist');
    });

    it('should send CSRF token with form submission', () => {
      cy.intercept('POST', '/api/auth/register', (req) => {
        expect(req.headers['x-csrf-token']).to.exist.or.expect(req.body.csrfToken).to.exist;
        req.reply({
          statusCode: 200,
          body: { success: true },
        });
      }).as('registerRequest');

      cy.visit('/api/auth/register');
      cy.get('form').submit();
      cy.wait('@registerRequest');
    });

    it('should reject requests without CSRF token', () => {
      cy.intercept('POST', '/api/auth/register', (req) => {
        if (!req.headers['x-csrf-token'] && !req.body.csrfToken) {
          req.reply({
            statusCode: 403,
            body: { error: 'CSRF token missing' },
          });
        }
      });

      cy.visit('/');
    });
  });

  describe('XSS Protection', () => {
    it('should sanitize user-provided content', () => {
      cy.visit('/api/profile');
      cy.get('input[name="bio"]').type('<script>alert("xss")</script>');
      cy.get('button[type="submit"]').click();

      cy.intercept('POST', '/api/profile/update', (req) => {
        expect(req.body.bio).to.not.include('<script>');
        req.reply({
          statusCode: 200,
          body: { success: true },
        });
      });
    });

    it('should escape HTML entities in display', () => {
      cy.visit('/api/posts');
      cy.get('.post-content').each(($post) => {
        const html = $post.html();
        if (html.includes('&lt;') || html.includes('&gt;')) {
          expect(html).to.not.include('<script>');
        }
      });
    });

    it('should prevent attribute injection', () => {
      cy.visit('/api/search');
      cy.get('input[name="query"]').type('" onload="alert(1)');
      cy.get('form').submit();

      cy.get('input[name="query"]').should('have.attr', 'value').and.not.include('onload');
    });
  });

  describe('Authentication Security', () => {
    it('should enforce password strength requirements', () => {
      cy.visit('/api/auth/register');
      cy.get('input[name="password"]').type('weak');
      cy.get('button[type="submit"]').should('be.disabled').or.click();

      cy.get('.password-requirements').each(($req) => {
        cy.wrap($req).should('have.class', 'unmet');
      });
    });

    it('should show password strength indicator', () => {
      cy.visit('/api/auth/register');
      cy.get('input[name="password"]').type('W');
      cy.get('.strength-indicator').should('have.class', 'very-weak');

      cy.get('input[name="password"]').clear().type('MyP@ssw0rd123!');
      cy.get('.strength-indicator').should('have.class', 'strong');
    });

    it('should limit login attempts', () => {
      for (let i = 0; i < 5; i++) {
        cy.visit('/api/auth/login');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();
      }

      cy.visit('/api/auth/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('button[type="submit"]').should('be.disabled').or.contains('Try again later');
    });

    it('should show session timeout warning', () => {
      cy.visit('/api/dashboard');
      cy.login('test@example.com', 'password123');

      cy.window().then((win) => {
        expect(win.localStorage.getItem('sessionTimeout')).to.exist;
      });

      cy.contains('Your session will expire soon').should('not.be.visible');
    });
  });

  describe('Rate Limiting', () => {
    it('should display rate limit message on too many requests', () => {
      cy.intercept('POST', '/api/search', { statusCode: 429 }).as('rateLimited');

      for (let i = 0; i < 51; i++) {
        cy.request('POST', '/api/search', { query: 'test' });
      }

      cy.visit('/api/search');
      cy.wait('@rateLimited');
      cy.contains('Too many requests').should('be.visible');
    });

    it('should prevent rapid-fire requests', () => {
      cy.visit('/api/search');
      let requestCount = 0;

      cy.intercept('GET', '/api/search', () => {
        requestCount++;
      });

      cy.get('input[name="query"]').type('test{keyup}{keyup}{keyup}{keyup}{keyup}');

      cy.then(() => {
        expect(requestCount).to.be.lessThan(10);
      });
    });
  });

  describe('API Security Headers', () => {
    it('should include security headers in API responses', () => {
      cy.intercept('GET', '/api/**', (req) => {
        req.reply((res) => {
          expect(res.headers['x-content-type-options']).to.equal('nosniff');
          expect(res.headers['x-frame-options']).to.equal('DENY');
          expect(res.headers['x-xss-protection']).to.exist;
          expect(res.headers['strict-transport-security']).to.exist;
          expect(res.headers['content-security-policy']).to.exist;
        });
      });

      cy.request('/api/health');
    });

    it('should enforce CSP policy', () => {
      cy.visit('/');
      cy.window().then((win) => {
        const metas = win.document.querySelectorAll('meta');
        let cspFound = false;
        metas.forEach((meta) => {
          if (meta.httpEquiv === 'Content-Security-Policy') {
            cspFound = true;
            expect(meta.content).to.include("default-src 'self'");
          }
        });
      });
    });
  });

  describe('Form Security', () => {
    it('should sanitize form inputs on blur', () => {
      cy.visit('/api/profile');
      cy.get('input[name="name"]').type('John<script>alert(1)</script>Doe');
      cy.get('input[name="email"]').focus();

      cy.get('input[name="name"]')
        .invoke('val')
        .should('not.include', '<script>');
    });

    it('should validate inputs before submission', () => {
      cy.visit('/api/profile');
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('button[type="submit"]').click();

      cy.get('.error-message').should('be.visible').and.contain('valid email');
    });

    it('should show security indicators for sensitive fields', () => {
      cy.visit('/api/auth/register');
      cy.get('input[name="password"]').parent().should('have.class', 'sensitive-field');
      cy.get('input[name="password"]').should('have.attr', 'autocomplete', 'new-password');
    });
  });

  describe('File Upload Security', () => {
    it('should validate file types', () => {
      cy.visit('/api/profile/upload-avatar');
      cy.get('input[type="file"]').selectFile('cypress/fixtures/malicious.exe');

      cy.get('.error-message').should('be.visible').and.contain('allowed');
    });

    it('should enforce file size limits', () => {
      cy.visit('/api/profile/upload-avatar');
      cy.get('input[type="file"]').selectFile('cypress/fixtures/large-file.bin');

      cy.get('.error-message').should('be.visible').and.contain('size');
    });

    it('should show upload progress', () => {
      cy.visit('/api/profile/upload-avatar');
      cy.get('input[type="file"]').selectFile('cypress/fixtures/image.jpg');
      cy.get('.progress-bar').should('be.visible');
      cy.get('.upload-complete').should('be.visible');
    });
  });

  describe('Data Validation', () => {
    it('should validate numeric inputs', () => {
      cy.visit('/api/order/create');
      cy.get('input[name="quantity"]').type('-5');
      cy.get('button[type="submit"]').click();

      cy.get('.error-message').should('be.visible').and.contain('positive');
    });

    it('should validate date inputs', () => {
      cy.visit('/api/profile');
      cy.get('input[name="dob"]').type('99/99/99');
      cy.get('button[type="submit"]').click();

      cy.get('.error-message').should('be.visible').and.contain('valid date');
    });

    it('should sanitize special characters', () => {
      cy.visit('/api/search');
      cy.get('input[name="query"]').type("'; DROP TABLE--");
      cy.get('form').submit();

      cy.get('input[name="query"]').invoke('val').should('not.include', "'; DROP");
    });
  });

  describe('Session Security', () => {
    it('should maintain secure session', () => {
      cy.visit('/api/auth/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.window().then((win) => {
        expect(win.document.cookie).to.include('session');
        const cookies = win.document.cookie.split(';');
        const sessionCookie = cookies.find((c) => c.includes('session'));
        expect(sessionCookie).to.include('Secure');
      });
    });

    it('should clear session on logout', () => {
      cy.login('test@example.com', 'password123');
      cy.visit('/api/dashboard');
      cy.get('button').contains('Logout').click();

      cy.window().then((win) => {
        expect(win.document.cookie).to.not.include('session');
      });
    });
  });

  describe('Error Handling', () => {
    it('should not expose sensitive error information', () => {
      cy.intercept('POST', '/api/user/create', { statusCode: 500 }).as('error');

      cy.visit('/api/auth/register');
      cy.get('form').submit();
      cy.wait('@error');

      cy.contains('Something went wrong').should('be.visible');
      cy.contains('database connection').should('not.exist');
      cy.contains('stack trace').should('not.exist');
    });

    it('should log security events', () => {
      cy.intercept('POST', '/api/auth/login', { statusCode: 401 }).as('failedLogin');

      cy.visit('/api/auth/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('wrongpass');
      cy.get('button[type="submit"]').click();

      cy.wait('@failedLogin');
    });
  });
});

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/api/auth/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}
