import React from 'react';
import cn from 'classnames';
import Section from 'common/components/section';
import styles from './header.scss';

type HeaderProps = {
    isWhite?: boolean;
};

export default (props: HeaderProps) => {
    const { isWhite = false } = props;

    return (
        <header id="header" className={cn(styles.header, isWhite && styles.isWhite)}>
            <Section contentClassName={styles.headerSectionContent}>

            </Section>
        </header>
    );
};
