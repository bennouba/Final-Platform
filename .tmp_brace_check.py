from pathlib import Path

path = Path(r"c:/Users/dataf/Downloads/Eishro-Platform_V7/src/pages/EnhancedMerchantDashboard.tsx")
lines = path.read_text(encoding="utf-8").splitlines()
curly = paren = square = 0
min_curly = min_paren = min_square = 0
min_curly_loc = min_paren_loc = min_square_loc = None
for idx, line in enumerate(lines, start=1):
    for col, ch in enumerate(line, start=1):
        if ch == '{':
            curly += 1
        elif ch == '}':
            curly -= 1
            if curly < min_curly:
                min_curly = curly
                min_curly_loc = (idx, col)
        if ch == '(':
            paren += 1
        elif ch == ')':
            paren -= 1
            if paren < min_paren:
                min_paren = paren
                min_paren_loc = (idx, col)
        if ch == '[':
            square += 1
        elif ch == ']':
            square -= 1
            if square < min_square:
                min_square = square
                min_square_loc = (idx, col)
print("net_curly", curly, "min", min_curly, "at", min_curly_loc)
print("net_paren", paren, "min", min_paren, "at", min_paren_loc)
print("net_square", square, "min", min_square, "at", min_square_loc)
