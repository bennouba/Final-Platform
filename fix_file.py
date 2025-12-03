import codecs

file_path = r'src\pages\EnhancedMerchantDashboard.tsx'

# Read file
with codecs.open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Original lines: {len(lines)}")

# Delete lines from 10417 to 11020 (0-indexed: 10416 to 11019)
new_lines = lines[:10416] + lines[11020:]

print(f"New lines: {len(new_lines)}")
print(f"Deleted: {len(lines) - len(new_lines)} lines")

# Write file
with codecs.open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Done!")
