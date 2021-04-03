async function encrypt(input) {
    const msgBuffer = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => ("00" + b.toString(16)).slice(-2)).join("");
    return hashHex;
}

export async function verifyHash(userAns, realHashedAns) {
    let hashedInput = await encrypt(userAns);
    console.log(hashedInput);
    return hashedInput === realHashedAns;
}
