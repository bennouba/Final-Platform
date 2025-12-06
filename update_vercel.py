import json

with open('vercel.json', 'r') as f:
    data = json.load(f)

data['env']['VITE_APP_API_URL'] = data['env'].pop('VITE_API_URL')

with open('vercel.json', 'w') as f:
    json.dump(data, f, indent=2)

print('Updated vercel.json successfully')
