import React from 'react';
// import Footer from 'common/components/footer';
import Section from 'common/components/section';
import Header from 'common/components/header';
import Topic from 'common/components/topic';

import styles from './home.scss';

export default class Home extends React.Component {
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
