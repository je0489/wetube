import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find( {} ).sort( { createdAt: "desc" });
    console.log( videos );
    return res.render( "home", { pageTitle: "Home", videos } );
  } catch ( e ) {
    return res.render( "error-search", { pageTitle: "Error", e } );
  }
}
export const watch = async ( req, res ) => {
    const { id } = req.params;
    const video = await Video.findById( id );
    if( !video ) {
      return res.render( "404", {pageTitle: "Video not found." } );
    }
    return res.render( "watch", { pageTitle: `Watching: ${video.title}`, video } );
}
export const getEdit = async ( req, res ) => {
    const { id } = req.params;
    const video = await Video.findById( id );
    if( !video ) {
      return res.render( "404", { pageTitle: "Video not found." } );
    }
    return res.render( "edit", { pageTitle: `Editing: ${video.title}`, video } );
}
export const postEdit = async ( req, res ) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    if( await !Video.exists( { _id: id } ) ) {
      return res.render( "404", { pageTitle: "Video not found" } );
    }
    await Video.findByIdAndUpdate( id, {
      title, 
      description,       
      hashtags: Video.formatHashtags( hashtags )
    } );
    return res.redirect( `/videos/${id}`);
}
export const getUpload = ( req, res ) => {
  return res.render( "upload", { pageTitle: `Uploading Video` } );
}
export const postUpload = async ( req, res ) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags( hashtags )
    });
    return res.redirect("/");
  } catch (e) {
    console.log(e);
    return res.render( "upload", { pageTitle: "Upload Video", errorMessage: e._message } );
  };
}
export const deleteVideo = async ( req, res ) => {
  const { id } = req.params;
  await Video.findByIdAndDelete( id );
  return res.redirect( "/" );
}
export const search = async ( req, res ) => {
  const { keyword } = req.query;
  let videos = [];
  if( keyword ) {
    videos = await Video.find({
      title: {
        $regex: new RegExp( keyword, "i" ) 
      }
    })
  }
  return res.render( "search", { pageTitle: "Search", videos } );
}