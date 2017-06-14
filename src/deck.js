import React from 'react';
import { View, Animated } from 'react-native';

class Deck extends React.Component {
    renderCard() {
        return this.props.data.map((item) => {
            return this.props.renderCard(item);
        });
    }

    render() {
        return (
            <View>
                {this.renderCard()}
            </View>   
        );
    }
}

export default Deck;
