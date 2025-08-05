import { Router } from "express";
const routes=Router();

routes.route("/login");
routes.route("/register");
routes.route("/add_to_activity");
routes.route("/get_all_activity");

export default routes;