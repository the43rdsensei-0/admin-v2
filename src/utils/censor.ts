export default function Censor(data:string) {
    const sectionOne = data.substring(0, data.length-2).split('');
    const sectionTwo = data.substring(data.length-2, data.length);

    for(var i=0; i < sectionOne.length; i++) sectionOne[i] = '*';

    return sectionOne.join('') + sectionTwo;
}