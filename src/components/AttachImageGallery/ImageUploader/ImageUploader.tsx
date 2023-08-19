export default function ImageUploader({child, submitFile}:{child:JSX.Element, submitFile:Function}) {
    return (
        <div>
            <label htmlFor="profile_picture">{ child }</label>
            <input 
                type="file"
                id="profile_picture"
                accept="image/*"
                onChange={(e)=> submitFile(e)}
                hidden
            />
        </div>
    )
}