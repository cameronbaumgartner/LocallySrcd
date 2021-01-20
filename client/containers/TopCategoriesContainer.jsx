import React, { Component } from 'react';
import TopCategoriesButton from '/client/components/TopCategoryButton.jsx';
class TopCategoriesContainer extends Component {
  constructor() {
    super();
    this.state = {
      categories: [
        ['Lifestyle', 'lifestyle'],
        ['Beauty', 'beauty'],
        ['Treats', 'bakery'],
        ['Sporty Goods', 'sporting goods'],
        ['Health', 'health'],
        ['Furry Friends', 'pets'],
        ['Dining', 'restaurants'],
        ['Home Life', 'plants'],
        ['Clothing', 'fashion'],
      ],
      hidden: true,
    };

  }

  updateHidden() {
    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.hidden ? newState.hidden = false : newState.hidden = true;
      return newState;
    });
  }

  render() {
    // map thru array of categories to create a category button for each one with category button
    const buttonCategories = this.state.categories.map((category, idx) => (
      <TopCategoriesButton
        key={`cat-${idx}`}
        categoryStr={category[0]}
        catBtnHandler={this.props.catBtnHandler}
        categoryKey={category[1]}
      />
    ));

    if (this.state.hidden) {
      return (
        <p id="catDrop" onClick={() => {this.updateHidden()}}>Click here to explore top store categories! ▼</p>
      )
    } else {
      return (
        <div>
          <p id="catDrop" onClick={() => {this.updateHidden()}}>Hide categories ▲</p>
          <div className="TopCateBox">
            {buttonCategories}
          </div>
        </div>
      )
    }
  }
}

export default TopCategoriesContainer;
