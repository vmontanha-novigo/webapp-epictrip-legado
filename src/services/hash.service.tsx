import jsSHA from 'jssha';

function getHash(password: string) {
    const hash = new jsSHA("SHA-256", "TEXT", {numRounds: 1});
    hash.update('Epic2022' + password);
    const passHash = hash.getHash("HEX");
    return passHash;
}

export default getHash;