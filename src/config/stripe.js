import Stripe from "stripe";
const useMock = (process.env.STRIPE_MOCK || "false").toLowerCase() === "true";
let stripe;
if (useMock) {
	stripe = {
		paymentIntents: {
			create: async ({ amount, currency }) => ({
				id: `pi_mock_${Date.now()}`,
				client_secret: `cs_mock_${Date.now()}`,
				amount,
				currency
			}),
			retrieve: async (id) => ({ id, status: "succeeded" })
		}
	};
} else {
	const rawKey = process.env.STRIPE_SECRET || process.env.STRIPE_SECRET_KEY || process.env.STRIPE_KEY;
	const key = typeof rawKey === "string" ? rawKey.trim() : rawKey;
	if (!key || !(key.startsWith("sk_test_") || key.startsWith("sk_live_"))) {
		throw new Error("Missing or invalid Stripe secret key. Set STRIPE_SECRET_KEY in .env (use sk_test_... for development)");
	}
	stripe = new Stripe(key, { apiVersion: "2022-11-15" });
}

export default stripe;
