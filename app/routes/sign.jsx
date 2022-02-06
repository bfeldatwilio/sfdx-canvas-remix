import { useLoaderData } from "remix";
import { verifyAndDecode } from "../utils/sf-tools";
import styles from "../styles/sign.css";

export function links() {
	return [
		{
			rel: "preload",
			href: "/assets/heart.svg",
			as: "image",
			type: "image/svg+xml",
		},
		{ rel: "stylesheet", href: styles },
	];
}

export const loader = async ({ context }) => {
	const { signedRequest } = context;
	const canvasRequest = verifyAndDecode(signedRequest);
	const client = canvasRequest.client;
	const links = canvasRequest.context.links;
	const params = canvasRequest.context.environment.parameters;

	// Build the url to fetch the agreement on the page
	const agreementRequestUrl =
		client.instanceUrl +
		links.sobjectUrl +
		`Apttus__APTS_Agreement__c/${params.recordId}`;

	// Build the request header with the oauth token passed
	// in from the signing request
	const reqHeader = new Headers({
		Authorization: "OAuth " + client.oauthToken,
		"Content-Type": "application/json",
	});

	// Build the request with the url and header
	const req = new Request(agreementRequestUrl, {
		method: "GET",
		headers: reqHeader,
		mode: "cors",
		cache: "default",
	});

	// Fetch data and deserialize it
	let agreementResponse = await fetch(req);
	let agreementJson = await agreementResponse.json();

	let dynamicResponse = {
		fullName: canvasRequest.context.user.fullName,
		agreementName: agreementJson.Name,
		agreementCompanyName: agreementJson.Account_Legal_Name__c,
	};

	return dynamicResponse;
};

export const action = async ({ request }) => {
	console.log("in the action");
	return null;
};

export default function sign() {
	const data = useLoaderData();
	return (
		<article className="tile-container">
			<div className="gradient-bg blue-gradient"></div>
			<div className="icon-overlay circle-svg"></div>
			<div className="tile-content">
				<h1>Remix</h1>
				<p>{data.fullName}</p>
				<p>{data.agreementCompanyName}</p>
				<p>{data.agreementName}</p>
			</div>
		</article>
	);
}
