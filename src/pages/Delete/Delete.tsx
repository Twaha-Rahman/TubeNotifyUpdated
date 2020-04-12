import * as React from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../../utilities/mapStateToProp';
import './Delete.css';
import DeleteCard from '../../components/DeleteCard/DeleteCard';
import refToDb from '../../utilities/dbOpener';
import dbReader from '../../utilities/dbReader';
import dbWritter from '../../utilities/dbWriter';
import { Redirect } from 'react-router';
import EmptyComponent from '../../components/EmptyComponent/EmptyComponent';
import { ReactComponent as Logo } from '../../media/image/empty.svg';

interface IDetailsObject {
  lookedUpToThisVideoTag: string;
  keyWords: string[];
}

interface IInfoObject {
  channelName: string;
  channelTag: string;
  channelLogoLink: string;
  keyWords: string[][];
  queryIndex: number;
}

class Delete extends React.Component<any> {
  constructor(props: any) {
    super(props); // store and route is in the props

    this.queryInfoExtractor = this.queryInfoExtractor.bind(this);
    this.queryInfoExtractor(refToDb, 'query');
  }

  public componentWillMount() {
    this.props.dispatch({
      type: 'eraseKeywords'
    });
    this.props.dispatch({
      type: 'eraseAdditionalInfo'
    });
  }

  public componentWillUnmount() {
    this.props.dispatch({
      type: 'eraseQueries'
    });
  }

  private async queryInfoExtractor(refToDb: any, objStore: string) {
    try {
      const queries = await dbReader(refToDb, objStore);

      if (queries.length === 0) {
        return false;
      }

      const queryInfoObjArr: IInfoObject[] = [];
      console.log(queries);

      queries.forEach((query: any, queryIndex: number) => {
        let keyWords: string[][] = [];
        query.details.forEach((detailObj: IDetailsObject) => {
          //keyWords = [...keyWords, ...detailObj.keyWords];
          keyWords.push(detailObj.keyWords);
        });
        const queryInfoObj: IInfoObject = {
          channelName: query.channelName,
          channelLogoLink: query.channelLogoLink,
          channelTag: query.channelTag,
          queryIndex,
          keyWords
        };
        queryInfoObjArr.push(queryInfoObj);
      });
      console.log(queryInfoObjArr);
      this.props.dispatch({
        type: 'addQueries',
        queries: queryInfoObjArr
      });
    } catch (error) {
      console.log(error);

      this.props.dispatch({
        type: `showError`
      });
    }
  }

  public render() {
    if (this.props.store.errorToggler) {
      return <Redirect to="/error" />;
    }

    const infoObjArr = this.props.store.addQueries;
    if (infoObjArr.length !== 0) {
      let renderDeleteCards: any[] = [];

      console.log(infoObjArr);

      infoObjArr.forEach((infoObj: IInfoObject, index: number) => {
        renderDeleteCards.push(
          <DeleteCard
            key={index.toString()}
            forceUpdater={this.forceUpdate.bind(this)}
            dispatchFunction={this.props.dispatch}
            queryIndex={infoObj.queryIndex}
            channelTag={infoObj.channelTag}
            channelName={infoObj.channelName}
            channelLogoLink={infoObj.channelLogoLink}
            keywords={infoObj.keyWords}
          />
        );
      });

      return renderDeleteCards;
    }

    return (
      <div>
        <EmptyComponent text="No subscription!" svgComponent={Logo} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Delete);
