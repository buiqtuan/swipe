import React from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.45*SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends React.Component {
    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();

        const panRes = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx , y: gesture.dy })
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            }
        });

        this.state = { panRes, position };
    }

    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH*1.5 : -SCREEN_WIDTH*1.5;
        Animated.timing(this.state.position, {
            toValue: { x: x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
    }

    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight } = this.props;
        direction === 'right' ? onSwipeRight() : onSwipeLeft();
    }

    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y:0 }
        }).start();
    }

    getCardStyle() {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH*1.5 ,0,SCREEN_WIDTH*1.5 ],
            outputRange: ['-120deg','0deg','120deg']
        });

        return {
            ...position.getLayout(),
            transform: [{ rotate: rotate }]
        };
    }

    renderCard() {
        return this.props.data.map((item, index) => {
            if (index === 0) {
                return (
                    <Animated.View
                        key={item.id}
                        {...this.state.panRes.panHandlers}
                        style={this.getCardStyle()}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }

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
