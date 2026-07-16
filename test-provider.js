const provider = require("./services/providers/ipo/investorgain.provider");

(async () => {

    try {

        const data = await provider.fetchIPOs();

        console.dir(data, {
            depth: null,
        });

    } catch (err) {

        console.error(err);

    }

})();