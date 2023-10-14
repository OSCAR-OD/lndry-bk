import ErrorMessage from "@shared/errorMessage";
import {failure, success} from "@shared/response";
import {Request, Response} from "express";
import StatusCodes from "http-status-codes";
import GiftAmountService from "@services/GiftAmountService";
import GiftThemeService from "@services/GiftThemeService";
import AdminGiftCardController from "@controller/admin/GiftCardController";

const {
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    UNPROCESSABLE_ENTITY,
    OK,
    UNAUTHORIZED,
} = StatusCodes;

class GiftCardController {
    async prices(req: Request, res: Response) {
        try {
            const data = await GiftAmountService.all();
            if (!data) {
                return res
                    .status(OK)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            return res
                .status(OK)
                .send(success(ErrorMessage.HTTP_OK, data));
        } catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).send(
                failure({
                    message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
                    errors: err,
                })
            );
        }
    }
    async templates(req: Request, res: Response) {
        try {
            const data = await GiftThemeService.all();
            if (!data) {
                return res
                    .status(OK)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            return res
                .status(OK)
                .send(success(ErrorMessage.HTTP_OK, data));
        } catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).send(
                failure({
                    message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
                    errors: err,
                })
            );
        }
    }
    async add(req: Request, res: Response) {
        return (await AdminGiftCardController.add(req, res));
    }
}

export default new GiftCardController();