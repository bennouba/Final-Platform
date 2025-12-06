import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np

fig, ax = plt.subplots(1, 1, figsize=(14, 10))
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

colors = {'frontend': '#4F46E5', 'backend': '#DC2626', 'db': '#2563EB', 'service': '#F59E0B'}

title = ax.text(5, 9.5, 'EISHRO Platform V7 - System Architecture', 
                fontsize=18, weight='bold', ha='center')

frontend_box = FancyBboxPatch((0.2, 7), 3, 1.5, boxstyle='round,pad=0.1', 
                              edgecolor=colors['frontend'], facecolor='#E0E7FF', linewidth=2)
ax.add_patch(frontend_box)
ax.text(1.7, 7.75, 'Frontend Layer', fontsize=11, weight='bold', ha='center')
ax.text(1.7, 7.35, 'React, TypeScript, Tailwind', fontsize=9, ha='center')

backend_box = FancyBboxPatch((3.7, 7), 3, 1.5, boxstyle='round,pad=0.1',
                             edgecolor=colors['backend'], facecolor='#FEE2E2', linewidth=2)
ax.add_patch(backend_box)
ax.text(5.2, 7.75, 'Backend Layer', fontsize=11, weight='bold', ha='center')
ax.text(5.2, 7.35, 'Node.js, Express, REST API', fontsize=9, ha='center')

db_box = FancyBboxPatch((7.2, 7), 2.6, 1.5, boxstyle='round,pad=0.1',
                        edgecolor=colors['db'], facecolor='#DBEAFE', linewidth=2)
ax.add_patch(db_box)
ax.text(8.5, 7.75, 'Database', fontsize=11, weight='bold', ha='center')
ax.text(8.5, 7.35, 'MySQL, Transactions', fontsize=9, ha='center')

services = [
    ('ChatBot', 0),
    ('FuzzySearch', 1.9),
    ('Inventory', 3.8),
    ('Notification', 5.7),
    ('SmartCart', 7.6)
]

service_y = 5.2
for service, x_offset in services:
    service_box = FancyBboxPatch((0.2 + x_offset, service_y), 1.7, 0.7, boxstyle='round,pad=0.05',
                                edgecolor=colors['service'], facecolor='#FEF3C7', linewidth=1.5)
    ax.add_patch(service_box)
    ax.text(1.05 + x_offset, service_y + 0.35, service, fontsize=9, ha='center', weight='bold')

ax.text(5, 5.8, 'Services Layer', fontsize=10, weight='bold')

components = [
    'Orders', 'Products', 'Customers', 'Payments', 'Shipping', 'Loyalty', 'Analytics', 'Reports'
]

for i, component in enumerate(components):
    comp_x = 0.3 + (i % 4) * 2.3
    comp_y = 3.2 - (i // 4) * 0.9
    comp_box = FancyBboxPatch((comp_x, comp_y), 2, 0.7, boxstyle='round,pad=0.05',
                             edgecolor='#10B981', facecolor='#D1FAE5', linewidth=1)
    ax.add_patch(comp_box)
    ax.text(comp_x + 1, comp_y + 0.35, component, fontsize=8, ha='center')

ax.text(5, 3.8, 'Core Controllers', fontsize=10, weight='bold')

integration_y = 1.3
integrations = [('Payment\nGateway', 1.2), ('AI Engine\n(Minimax)', 3.5), ('Storage\n(AWS S3)', 5.8), ('Maps\n(Leaflet)', 8)]
for name, x in integrations:
    int_box = FancyBboxPatch((x-0.8, integration_y), 1.6, 0.8, boxstyle='round,pad=0.05',
                            edgecolor='#8B5CF6', facecolor='#EDE9FE', linewidth=1.5)
    ax.add_patch(int_box)
    ax.text(x, integration_y + 0.4, name, fontsize=8, ha='center')

ax.text(5, 2.2, 'External Integrations', fontsize=10, weight='bold')

plt.tight_layout()
plt.savefig(r'c:\Users\dataf\Downloads\Eishro-Platform_V7\docs\ARCHITECTURE\system-architecture.png', 
            dpi=300, bbox_inches='tight', facecolor='white')
print('✅ System Architecture diagram created')
