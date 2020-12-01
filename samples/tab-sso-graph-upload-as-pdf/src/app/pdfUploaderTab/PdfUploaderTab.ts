import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/pdfUploaderTab/index.html")
@PreventIframe("/pdfUploaderTab/config.html")
@PreventIframe("/pdfUploaderTab/remove.html")
export class PdfUploaderTab {
}
