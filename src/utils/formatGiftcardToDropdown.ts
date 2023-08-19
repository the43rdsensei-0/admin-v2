export default function formatGiftcardToDropdown(assets:any[]) {
    return assets.filter(asset => asset.subCategories.length).map(asset => {
        return {
            id: asset.id,
            label: asset.name,
            options: asset.subCategories
        }
    })
}