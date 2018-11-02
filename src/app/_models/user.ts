export class User {
    id: number;
    fname: string = "Anon";
    lname: string;
    address: string;        // optional
    phone: string;          // optional
    email: string;
    gender: string;         // optional
    dob: string;

    created_at: string;
    updated_at: string;

    jwt: JWT;
}


export class JWT {
    public static tokenAuthPrefix: string = "Bearer ";
    tokenString: string;
    tokenHeader: object;
    tokenPayload: object;
    tokenSignature: string;

    /**
     * Parse a base64 encoded JWT string into JWT object
     * @param token base64 encoded JWT string
     */
    constructor ( token: string ){
        this.tokenString = token;
        token = token.replace ( JWT.tokenAuthPrefix, '' );
        let split: Array<string> = token.split('.');

        this.tokenHeader = JSON.parse ( atob(split[0]) );
        this.tokenPayload = JSON.parse ( atob(split[1]) );
        this.tokenSignature = split[2];

        console.log (
            'JWT: header payload signature', 
            this.tokenHeader, 
            this.tokenPayload,
            this.tokenSignature
        );
    }
}


/*
	A JWT token consists of a header, payload, and signature. 
    The header & payload are base64 encoded, and the signature is appended to the end, following a '.' character
*/