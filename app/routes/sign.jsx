import { useLoaderData } from "remix";
import { verifyAndDecode } from "../utils/sf-tools";

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
	};

	return dynamicResponse;
};

export const action = async ({ request }) => {
	console.log("in the action");
	return null;
};

export default function sign() {
	const { fullName, agreementName } = useLoaderData();
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	console.log(fullName, agreementName);
	return (
		<>
			<div>
				Hello {fullName}
				<p>Agreement: {agreementName}</p>
			</div>
		</>
	);
}
