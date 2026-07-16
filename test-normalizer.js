const provider = require("./services/providers/ipo/investorgain.provider");

const {
    normalizeIPOs,
} = require("./services/providers/ipo/normalizer");

(async () => {

    try {

        const raw = await provider.fetchIPOs();

        const normalized = normalizeIPOs(raw);

        console.dir(normalized, {
            depth: null,
        });

    } catch (err) {

        console.error(err);

    }

})();