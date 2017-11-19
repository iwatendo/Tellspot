import LinkUtil from "../../Base/Util/LinkUtil";

let pid = LinkUtil.GetPeerID();

if (pid) {
    window.location.href = LinkUtil.CreateLink("CastInstance/", pid);
}
else {
    window.location.href = LinkUtil.CreateLink("HomeInstance/");
}
