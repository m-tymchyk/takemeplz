import React from 'react';
import Footer from 'common/components/footer';
import Header from 'common/components/header';

import styles from './home.scss';

export default class Home extends React.Component {
    public render(): JSX.Element {
        return (
            <>
                <Header />

                <div className={styles.homeLandingContent}>
                    Проект в разработке.
                </div>
                <Footer />
            </>
        );
    }
}
