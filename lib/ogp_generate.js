const ogp_generate = {};

const firebase_admin = require("firebase-admin");

firebase_admin.initializeApp({
  credential: firebase_admin.credential.cert("./secret/mixidea-91a20-firebase-adminsdk.json"),
  databaseURL: "https://mixidea-91a20.firebaseio.com"
});

/*

function get_fixed_ogphtml(full_url){
    const ogp_url = '<meta property="og:url" content="' + full_url + '" />';
    const ogp_title = '<meta property="og:title" content="online debate platform" />';
    const ogp_description = '<meta property="og:description" content=" online debate platform" />'
    const image_url = "https://storage.googleapis.com/mixidea_resource/icon_withname.png";
    const ogp_image = '<meta property="og:image" content="' + image_url + '" />';

    html_text =  "<html><head><title>online debate platform</title>" + 
                    ogp_url + ogp_title + ogp_description + ogp_image + "</head><body>aaa</body</html>"
    console.log(html_text);
    return html_text;
}

*/

function get_html( full_url , title, description ){

    const ogp_url = '<meta property="og:url" content="' + full_url + '" />';
    const ogp_title = '<meta property="og:title" content="' + title  + '" />';
    const ogp_description = '<meta property="og:description" content="' + description + '" />'
    const image_url = "https://storage.googleapis.com/mixidea_resource/icon_withname.png";
    const ogp_image = '<meta property="og:image" content="' + image_url + '" />';
    const ogp_facebook_appid = '<meta property="fb:app_id" content="922863714492725" />'

    html_text =  "<html><head><title>" + title + "</title>" + 
                    ogp_url + ogp_title + ogp_description + ogp_image + ogp_facebook_appid + "</head><body>aaa</body</html>"
    console.log(html_text);
    return html_text;

}


ogp_generate.respond_ogp = function(req, res, next, full_url, url_path){

    const url_arr = url_path.split("/");
    console.log(url_arr);

    if( url_arr[1]==="event" && url_arr[2]==="eventcontext" && url_arr[3]){
        const event_id = url_arr[3];
        respond_event_ogp(req, res, next, full_url, event_id);
        return;
    }else if (url_arr[1]==="livevideo-debate-audio-serverrecognition" && url_arr[2]){
        console.log("categirized as livevideo-debate-audio-serverrecognition ")
        const event_id = url_arr[2];
        respond_audioserverrecognition_ogp(req, res, next, full_url, event_id);
        return;
    }



    return get_html( title_text, detail_text);


}



function respond_event_ogp(req, res, next, full_url, event_id){

    const event_ref = "/event_related/event/" + event_id;
    firebase_admin.database().ref(event_ref).once("value")
    .then( (snapshot)=>{
        const event_context = snapshot.val();
        console.log(event_context);
        let title_text = " online debate"
        if(event_context.type === "ONLINE_DEBATE_LIVEVIDEO"){
            const start_time = new Date(event_context.date_time_start);
            start_time_str = start_time.toUTCString()
            const event_title = event_context.title;
            title_text = "Online Live Video Debate Event from " + start_time_str  + "&nbsp; (Differnt by the time zone)"
            const detail_text =  event_title;
            const html_text = get_html(full_url, title_text, detail_text);
            res.send(html_text);
            return;
        }else if(event_context.type === "ONLINE_DEBATE_WRITTEN"){
            next();
        }


    }).catch((err)=>{
        console.log("error to retrieve event info from firebase", err);
       // const html_text = get_fixed_ogphtml(full_url);
        next();

    })
}

function respond_audioserverrecognition_ogp(req, res, next, full_url, event_id){

    const event_ref = "/event_related/audio_transcriptserver/" + event_id;
    firebase_admin.database().ref(event_ref).once("value")
    .then( (snapshot)=>{
        const aurioarticle_context = snapshot.val();
        console.log("event_context", aurioarticle_context);
        const title_text = "online written debate "
        const detail_text =  aurioarticle_context.motion;
        const html_text = get_html(full_url, title_text, detail_text);
        res.send(html_text);

    }).catch((err)=>{
        console.log("error to retrieve event info from firebase", err);
       // const html_text = get_fixed_ogphtml(full_url);
        next();

    })


}





module.exports = ogp_generate;