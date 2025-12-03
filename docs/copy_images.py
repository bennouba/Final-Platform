import shutil
import os

source = r'c:\Users\dataf\Downloads\Eishro-Platform_V7\dist\assets\andish'
dest_products = r'c:\Users\dataf\Downloads\Eishro-Platform_V7\public\assets\indeesh\products'
dest_logo = r'c:\Users\dataf\Downloads\Eishro-Platform_V7\public\assets\indeesh\logo'

try:
    os.makedirs(dest_products, exist_ok=True)
    os.makedirs(dest_logo, exist_ok=True)
    
    # Copy Products folder
    products_src = os.path.join(source, 'Products')
    if os.path.exists(products_src):
        for file in os.listdir(products_src):
            src_file = os.path.join(products_src, file)
            dest_file = os.path.join(dest_products, file)
            if os.path.isfile(src_file):
                shutil.copy2(src_file, dest_file)
        
        files_count = len(os.listdir(dest_products))
        print(f"✅ Copied {files_count} product images")
    
    # Copy Andish.jpg as logo
    src_logo = os.path.join(source, 'Andish.jpg')
    if os.path.exists(src_logo):
        dest_logo_file = os.path.join(dest_logo, 'Indeesh.jpg')
        shutil.copy2(src_logo, dest_logo_file)
        print("✅ Copied logo")
        
    print("\n✅ All images copied successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
