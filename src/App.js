import React, { Component } from 'react'
import { extend } from 'lodash'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination, HitsStats, SortingSelector, NoHits,
  ResetFilters,DynamicRangeFilter,RangeFilter,NumericRefinementListFilter,
  ViewSwitcherHits, ViewSwitcherToggle,
  InputFilter, GroupedSelectedFilters,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar } from 'searchkit'
import './index.css'

// const host = "http://demo.searchkit.co/api/movies"
const host = "http://localhost:9200/rede_midia_ativismo_pos_junho"
const searchkit = new SearchkitManager(host)

// const MovieHitsGridItem = (props)=> {
//   const {bemBlocks, result} = props
//   let url = "http://www.imdb.com/title/" + result._source.id
//   const source:any = extend({}, result._source, result.highlight)
//   return (
//     <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
//       <a href={url} target="_blank">
//         {/*<img data-qa="poster" alt="presentation" className={bemBlocks.item("poster")} src={result._source.poster} width="170" height="240"/>*/}
//         <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}>
//         </div>
//       </a>
//     </div>
//   )
// }

function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  // let url = "http://www.imdb.com/title/" + result._source.imdbId
  let url = result._source.post_link
  const source:any = extend({}, result._source, result.highlight)
  
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      {/*<div className={bemBlocks.item("poster")}>
        <img alt="presentation" data-qa="poster" src={result._source.poster}/>
      </div>*/}
      <hr/>
      <div className={bemBlocks.item("details")}>
        
        {/*<a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2></a>*/}
        <h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.page_name}}></h2>
        {/*<h3 className={bemBlocks.item("subtitle")}>Published in { (new Date(source.post_published)).toString()}</h3>*/}
        <a href={url} target="_blank"><h3 className={bemBlocks.item("subtitle")} >Published in { (new Date(source.post_published)).toString()}</h3></a>
        
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:linkify(source.post_message)}}></div>
        <br/>
        <div className={bemBlocks.item("subtitle")} >Tópicos : {source.topic_label}</div>
        <div className={bemBlocks.item("subtitle")} >
          <a href={url} target="_blank">Likes {source.likes} - Shares {source.shares} - Comments {source.comments} - Engagement {source.engagement}
            </a>
          </div>
        
      </div>
      
    </div>
    
  )
}

class App extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <SearchBox autofocus={true} queryOptions={{analyzer:"standard"}} 
                      searchOnChange={true} 
                      queryFields={["post_message^15","page_name^5","keywords^10"]}
                      prefixQueryFields={["post_message^15","page_name^5","keywords^10"]}/>
            
        
          </TopBar>

        <LayoutBody>

          <SideBar>
            <InputFilter id="page_name" 
              highlightFields={["page_name"]}
              searchThrottleTime={500} title="Page name" placeholder="Search page" searchOnChange={true} queryFields={["page_name"]} />
            <RefinementListFilter id="status_type" title="Post type" field="type" size={10}/>
            
              <RangeFilter min={100} max={10000} field="engagement" id="engagement" title="Engagement" showHistogram={true}/>
                <RangeFilter min={100} max={10000} field="likes" id="likes" title="Likes" showHistogram={true}/>
                {/*<RangeFilter min={10} max={10000} field="comments" id="comments" title="Comments" showHistogram={true}/>*/}
                {/*<RangeFilter min={10} max={10000} field="shares" id="shares" title="Shares" showHistogram={true}/>*/}
                
                
                <RefinementListFilter id="topic_label" title="Topics" field="topic_label" size={10}/>
            {/*<RefinementListFilter id="topic" title="Topic" field="topic_id" size={10}/>*/}
            {/*<RefinementListFilter id="page_name" title="Page" field="page_name" size={10}/>*/}

                {/*<DynamicRangeFilter field="likes" id="likes" title="Likes" rangeFormatter={(count)=> count + "*"}/>
                <DynamicRangeFilter field="comments" id="comments" title="Comments" rangeFormatter={(count)=> count + "*"}/>
                <DynamicRangeFilter field="shares" id="shares" title="Shares" rangeFormatter={(count)=> count + "*"}/>
                <DynamicRangeFilter field="engagement" id="engagement" title="Engagement" rangeFormatter={(count)=> count + "*"}/>
                */}
                {/*<NumericRefinementListFilter id="engagement" title="Engagement" field="engagement" options={[
              {title:"All"},
              {title:"up to 500", from:0, to:50},
              {title:"501 to 1000", from:501, to:1000},
              {title:"1001 or more", from:1001, to:100000}
            ]}/>*/}

                

          </SideBar>
          <LayoutResults>
            <ActionBar>

              <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[
                  {label:"Relevance", field:"_score", order:"desc"},
                  {label:"Newer posts", field:"post_published", order:"desc"},
                  {label:"Older posts", field:"post_published", order:"asc"}
                ]}/>
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <ViewSwitcherHits
                hitsPerPage={12} highlightFields={["post_message","page_name"]}
                sourceFilter={["post_message", "page_name", "topic_id","topic_label", "post_published","likes","comments","shares","engagement","post_link"]}
                hitComponents={[
                  {key:"list", title:"List", itemComponent:MovieHitsListItem, defaultOption:true}
                ]}
                scrollTo="body"
            />
            <NoHits suggestionsField={"post_message"}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

export default App;
//{/*{key:"grid", title:"Grid", itemComponent:MovieHitsGridItem, defaultOption:true},*/}