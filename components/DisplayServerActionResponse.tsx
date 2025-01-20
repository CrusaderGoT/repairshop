type ResultProps = {
    result: {
        data?:{ messsage: string } | undefined,
        serverError?: string,
        validationErrors?:  Record<string, string[] | undefined>,
        bindArgsValidationErrors?: readonly [] | undefined,
    }
}

const MessageBox = ({
    type,
    content
}: {
    type: 'success' | 'error',
    content: React.ReactNode,
}) => (
    <div className={`bg-accent px-4 py-2 rounded-lg ${type === 'error' ? 'text-red-500' : ''}`}>
        {type === 'success' ? '🎉' : '❌'} {content}
    </div>
)

export function DisplayServerActionResponse({ result }: ResultProps) {
    const { data, serverError, validationErrors } = result;

    return (
        <div>
            {data?.messsage && (
                <MessageBox type="success" content={`Success: ${data.messsage}`} />
            )}

            {serverError && (
                <MessageBox type="error" content={serverError} />
            )}

            {validationErrors && (
                <MessageBox type="error"
                content={
                    Object.keys(validationErrors).map((key) => (
                        <p key={key}>{
                            `${key}: ${validationErrors[key as keyof typeof validationErrors]}`
                        }</p>
                    ))
                }
                />
            )}
        </div>
    )
}