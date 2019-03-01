import React from 'react'
import Gist from 'react-gist'
import Parser from 'html-react-parser'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Layout } from '../components/common'
import { MetaData } from '../components/common/meta'

/**
* Single post view (/:slug)
*
* This file renders a single post and loads all the content.
*
*/
const Post = ({ data, location }) => {
    const post = data.ghostPost

    // We're extracting the Gist script tags as they won't be rendered by React
    const urlRegexString = 'https:\/\/gist.github.com\/(.+)\/(.+)\.js'
    const urlRegex = new RegExp(urlRegexString)

    const reactHtml = Parser(post.html, {
        replace: (domNode) => {
            if (domNode.name === "script") {
                const [_, username, gistId] = domNode.attribs.src.match(urlRegex)
                return <Gist id={gistId}/>
            }
        }
    })

    return (
            <>
                <MetaData
                    data={data}
                    location={location}
                    type="article"
                />
                <Layout>
                    <div className="container">
                        <article className="content">
                            { post.feature_image ?
                                <figure className="post-feature-image">
                                    <img src={ post.feature_image } alt={ post.title } />
                                </figure> : null }
                            <section className="post-full-content">
                                <h1 className="content-title">{post.title}</h1>

                                {/* The main post content */ }
                                <section
                                    className="content-body load-external-scripts">
                                    { reactHtml }
                                </section>
                            </section>
                        </article>
                    </div>
                </Layout>
            </>
    )
}

Post.propTypes = {
    data: PropTypes.shape({
        ghostPost: PropTypes.shape({
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            feature_image: PropTypes.string,
        }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
}

export default Post

export const postQuery = graphql`
    query($slug: String!) {
        ghostPost(slug: { eq: $slug }) {
            ...GhostPostFields
        }
    }
`
