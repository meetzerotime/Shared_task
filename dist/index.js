"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PORT = 3000;
const app = (0, express_1.default)();
const body_parser_1 = __importDefault(require("body-parser"));
const solutioncode_1 = __importDefault(require("./solutioncode"));
// Middleware
app.use(body_parser_1.default.json());
// Define routes
app.post('/request', (req, res) => {
    (0, solutioncode_1.default)(req, res);
});
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
