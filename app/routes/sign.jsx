import { useLoaderData } from "remix";
import { verifyAndDecode } from "../utils/sf-tools";

export const loader = async ({ context }) => {
	const { signedRequest } = context;
	const canvasRequest = verifyAndDecode(signedRequest);
	const client = canvasRequest.client;
	const links = canvasRequest.context.links;
	const params = canvasRequest.context.environment.parameters;

	const agreementRequestUrl =
		client.instanceUrl +
		links.sObjectUrl +
		`Apttus__APTS_Agreement__c/${params.recordId}`;

	let data = {
		agreementUrl: agreementRequestUrl,
		user: canvasRequest.context.user,
	};
	return data;
};

export const action = async ({ request }) => {
	console.log("in the action");
	return null;
};

export default function sign() {
	const data = useLoaderData();

	console.log(data);
	return (
		<>
			<div>
				Hello {data.user.fullName}
				<p>Agreement Url: {data.agreementUrl}</p>
			</div>
		</>
	);
}
