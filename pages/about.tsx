import cn from 'classnames';
import Container from '../components/container';

export default function Home() {
    let title = "hello";
    let gradient = 'from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]';
    return (
        <Container>
            <div className="flex flex-col justify-center items-start max-w-2xl border-gray-200 dark:border-gray-700 mx-auto pb-16">
                <p>Coming Soon</p>
            </div>
        </Container>
    )
}