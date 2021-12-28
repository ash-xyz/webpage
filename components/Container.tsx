import Head from 'next/head'

export default function Container(props) {
    const { children } = props;

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col justify-center px-8">
                {/*TODO: Maybe insert some header data for SSO*/}
                <main>
                    {children}
                </main>
            </div>
        </div>
    )
}