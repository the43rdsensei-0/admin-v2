export default function formatCryptoAsset(assets:any[]) {
    return assets.map((asset:any)=> {
        return {
            id: asset.id || asset._id,
            active: asset.active,
            imageURL: asset.imageURL,
            label: `${asset.name} ${asset.shortCode}`,
            name: asset.name,
            shortCode: asset.shortCode,
            channels: asset.channels.map((channel:any) => {
                return {
                    ...channel,
                    id: channel._id || channel.id
                }
            })
        }
    })
}
