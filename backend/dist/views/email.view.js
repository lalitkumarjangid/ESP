"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSummaryDto = exports.EmailResponseDto = exports.GenerateEmailDto = void 0;
const class_transformer_1 = require("class-transformer");
class GenerateEmailDto {
    email;
    subject;
}
exports.GenerateEmailDto = GenerateEmailDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GenerateEmailDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GenerateEmailDto.prototype, "subject", void 0);
class EmailResponseDto {
    id;
    subject;
    receivingChain;
    espType;
    timestamp;
    processed;
    senderEmail;
    metadata;
}
exports.EmailResponseDto = EmailResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmailResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmailResponseDto.prototype, "subject", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], EmailResponseDto.prototype, "receivingChain", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmailResponseDto.prototype, "espType", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], EmailResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], EmailResponseDto.prototype, "processed", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EmailResponseDto.prototype, "senderEmail", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], EmailResponseDto.prototype, "metadata", void 0);
class EmailSummaryDto {
    totalEmails;
    uniqueESPs;
    averageServerCount;
    recentEmails;
}
exports.EmailSummaryDto = EmailSummaryDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], EmailSummaryDto.prototype, "totalEmails", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], EmailSummaryDto.prototype, "uniqueESPs", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], EmailSummaryDto.prototype, "averageServerCount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], EmailSummaryDto.prototype, "recentEmails", void 0);
//# sourceMappingURL=email.view.js.map