import { PieceAuth, Property, Validators } from "@activepieces/pieces-framework";
import { getLists } from "./api";

export type BettermodeAuthType = {
	region   : string,
	domain   : string,
	email    : string,
	password : string,
	token    : string|undefined,
}

export const bettermodeAuth = PieceAuth.CustomAuth({
    description: "Your domain should be the base URL of your Bettermode community. Example: https://community.example.com",
    props: {
        region: Property.StaticDropdown({
			displayName: 'Region',
			description: 'The region of your Bettermode account',
			required: true,
			options: {
				options: [
					{ label: 'US Region', value: 'https://api.bettermode.com' },
					{ label: 'EU Region', value: 'https://api.bettermode.de'  },
				]
			}
		}),
        domain: Property.ShortText({
			displayName : 'BetterMode Domain',
			description : 'The domain of your Bettermode account',
			required    : true,
			validators: [Validators.url],
        }),
		email: Property.ShortText({
			displayName : 'Email',
			description : 'Email address for your Bettermode account',
			required    : true,
			validators: [Validators.email],
		}),
        password: PieceAuth.SecretText({
			displayName : 'Password',
			description : 'Password for your Bettermode account',
			required    : true,
        }),
    },
    validate: async ({ auth }) => {
		try {
			await validateAuth(auth);
			return {
				valid : true,
			};
		} catch (e) {
			return {
				valid : false,
				error : (e as Error)?.message
			};
		}
    },
    required : true
});

const validateAuth = async (auth: BettermodeAuthType) => {
	const response = await getLists(auth);
	if (response.success !== true) {
		throw new Error('Authentication failed. Please check your domain and API key and try again.');
	}
}
