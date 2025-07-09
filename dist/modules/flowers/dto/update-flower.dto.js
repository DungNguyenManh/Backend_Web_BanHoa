"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFlowerDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_flower_dto_1 = require("./create-flower.dto");
class UpdateFlowerDto extends (0, mapped_types_1.PartialType)(create_flower_dto_1.CreateFlowerDto) {
}
exports.UpdateFlowerDto = UpdateFlowerDto;
//# sourceMappingURL=update-flower.dto.js.map