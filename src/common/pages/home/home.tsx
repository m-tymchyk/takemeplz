import React from 'react';
// import Footer from 'common/components/footer';
import Section from 'common/components/section';
import Header from 'common/components/header';
import Topic from 'common/components/topic';

import styles from './home.scss';
import Axios from 'axios';

export default class Home extends React.Component {

    public async componentDidMount(): Promise<void> {
        try {
            const response = await Axios.get('http://localhost:8082/auth/me');
            console.log(response);
        } catch (error) {
            const response = await Axios.post('http://localhost:8082/auth/login', {
                username: 'test-user',
                password: 'my-password',
            });

            console.log(response);
        }
    }

    public render(): JSX.Element {
        return (
            <>
                <Header />

                <Section className={styles.homeLandingContent}>
                    <Topic titleText="Кто-то ведь должен был это сделать."
                           descText="Скоро вы отправитесь в прекрасное путешествие"
                           isIntro
                           titleTag="h1"
                    />
                </Section>
            </>
        );
    }
}
