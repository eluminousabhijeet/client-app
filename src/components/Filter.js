import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sortProducts, fetchProducts } from '../actions/productActions';

class Filter extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    {this.props.products.length} products found.
                </div>
                <div className="col-md-4">
                    <label>
                        Order by
                        <select className="form-control" value={this.props.sort}
                            onChange={(e) => this.props.sortProducts(this.props.products, e.target.value)}
                        >
                            <option>Select</option>
                            <option value="lowest">Price: Low to High</option>
                            <option value="highest">Price: High to Low</option>
                        </select>
                    </label>
                </div>
                <div className="col-md-4"></div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    products: state.products.sortedItems,
    sort: state.products.sort
});

export default connect(mapStateToProps, { sortProducts })(Filter);