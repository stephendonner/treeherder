import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateSelectedBugDetails, updateDateRange, updateTreeName } from './redux/actions';
import { getBugUrl } from '../helpers/urlHelper';

class BugColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayBugDetails: false,
    };
    this.displayBugText = this.displayBugText.bind(this);
    this.updateStateData = this.updateStateData.bind(this);
  }

  displayBugText() {
    this.setState({ displayBugDetails: !this.state.displayBugDetails });
  }

  updateStateData() {
    // bugdetailsview inherits data from the main view
    const { data, updateDates, updateTree, updateBugDetails, from, to, tree } = this.props;

    updateBugDetails(data.id, data.summary, 'BUG_DETAILS');
    updateTree(tree, 'BUG_DETAILS');
    updateDates(from, to, 'BUG_DETAILS');
  }

  render() {
    const { tree, from, to } = this.props;
    const { id } = this.props.data;
    return (
      <div onMouseEnter={this.displayBugText} onMouseLeave={this.displayBugText}>
        <span className="text-primary">{id}</span><span className={`ml-1 small-text ${this.state.displayBugDetails ? '' : 'hidden'}`}>
          <Link onClick={this.updateStateData} to={{ pathname: '/bugdetails', search: `?startday=${from}&endday=${to}&tree=${tree}&bug=${id}` }}>
            details
          </Link>
          <a className="ml-1" target="_blank" href={getBugUrl(id)}>bugzilla</a>
        </span>
      </div>
    );
  }
}

BugColumn.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    summary: PropTypes.string.isRequired,
  }).isRequired,
  updateDates: PropTypes.func,
  updateTree: PropTypes.func,
  updateBugDetails: PropTypes.func,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  tree: PropTypes.string.isRequired,
};

BugColumn.defaultProps = {
  updateTree: null,
  updateDates: null,
  updateBugDetails: null,
};

const mapStateToProps = state => ({
  from: state.dates.from,
  to: state.dates.to,
  tree: state.mainTree.tree,
});

const mapDispatchToProps = dispatch => ({
  updateBugDetails: (bugId, summary, name) => dispatch(updateSelectedBugDetails(bugId, summary, name)),
  updateDates: (from, to, name) => dispatch(updateDateRange(from, to, name)),
  updateTree: (tree, name) => dispatch(updateTreeName(tree, name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BugColumn);
