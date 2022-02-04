const ajaxCallPromise = async (client, queryUrl) => {
	let promise = await new Promise((resolve, reject) => {
		global.Sfdc.canvas.client.ajax(queryUrl, {
			client: client,
			success: function (data) {
				if (data.status === 200) {
					resolve(data.payload);
				} else {
					reject(data.status);
				}
			},
		});
	});
	return promise;
};

const getRefreshSignedRequest = async () => {
	let promise = await new Promise((resolve, reject) => {
		global.Sfdc.canvas.client.refreshSignedRequest(function (data) {
			if (data.status === 200) {
				resolve(data);
			} else {
				reject(data);
			}
		});
	});
	return promise;
};

const getCurrentContext = async (client) => {
	let promise = await new Promise((resolve, reject) => {
		global.Sfdc.canvas.client.ctx((msg) => {
			if (msg.status !== 200) reject(msg);
			resolve(msg.payload);
		}, client);
	});
	return promise;
};

export { ajaxCallPromise, getRefreshSignedRequest, getCurrentContext };
