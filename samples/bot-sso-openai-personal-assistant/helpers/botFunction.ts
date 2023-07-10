export abstract class BotFunction {

    public functionName: string;
    public openAIMessages: any[];

    public operationWithSSOToken: (
        arg0: any,
        ssoToken: string
    ) => Promise<any> | undefined;

    public operationResultProcessor: (
        arg0: any,
        operationResult: any
    ) => Promise<any> | undefined;

    validateParameters(parameters: any): boolean {
        if (!parameters.ssoDialog) {
            throw new Error(`BotFunction failed: missing input "ssoDialog".`);
        }
        if (!parameters.context) {
            throw new Error(`BotFunction failed: missing input "context".`);
        }
        if (!parameters.dialogState) {
            throw new Error(`BotFunction failed: missing input "dialogState".`);
        }
        return true;
    }

    async run(parameters: any): Promise<any> {
        this.validateParameters(parameters);
        const ssoDialog = parameters.ssoDialog;
        ssoDialog.setSSOOperation(this.operationWithSSOToken);
        ssoDialog.setSSOOperationResultProcessor(this.operationResultProcessor);
        await ssoDialog.run(parameters.context, parameters.dialogState);
    }

}