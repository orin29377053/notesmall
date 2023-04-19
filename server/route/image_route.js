const router = require("express").Router();
const { getImagePresignedUrl } = require("../controllers/image_controller");

router.route("/image/getImagePresignedUrl").get(getImagePresignedUrl);

module.exports = router;
