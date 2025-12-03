
// Clear localStorage cache for Indeesh store
(function() {
    console.log('🧹 Clearing Indeesh store cache...');
    
    // Clear all Indeesh-related localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
            key.includes('indeesh') || 
            key.includes('store_products_indeesh') ||
            key.includes('eshro_store_files_indeesh') ||
            key.includes('store_sliders_indeesh')
        )) {
            keysToRemove.push(key);
        }
    }
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log('🗑️ Removed:', key);
    });
    
    console.log('✅ Cache cleared! Please refresh the page to reload correct data.');
    
    // Force page reload after a short delay
    setTimeout(() => {
        console.log('🔄 Reloading page...');
        window.location.reload();
    }, 1000);
})();
