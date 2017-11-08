/**
 * GitHub  https://github.com/tanaikech/ProjectApp<br>
 * @param {Object} Object PropertiesService.getScriptProperties()
 * @return {ProjectApp}
 */
function init(e) {
    this.prop = e;
    this.at = ScriptApp.getOAuthToken();
    return this;
}

// ----- Authorization
/**
 * Set client ID and client secret to PropertiesService.<br>
 * @param {String} client_id client_id
 * @param {String} client_secret client_secret
 * @return {Object} Return PropertiesService as JSON
 */
function setProp(client_id, client_secret) {
    return new ProjectApp(false, this.prop, null).setprop(client_id, client_secret);
}

/**
 * Retrieve access token and refresh token.<br>
 * This is used at doGet().<br>
 */
function getAccesstoken(e) {
    var PA = new ProjectApp(false, this.prop, null);
    if (!e.length) {
        return PA.doGet();
    } else if (e.length > 1) {
        if (e[0] == "doget") {
            PA.saveRefreshtoken(JSON.parse(e[1]).refresh_token);
        }
    }
    return;
}

/**
 * Retrieve access token and refresh token.<br>
 * This is used at doGet().<br>
 */
function getCode(e) {
    return new ProjectApp(false, null, null).callback(e);
}

// ----- Methods
/**
 * Retrieve project as blob.<br>
 * @param {String[]} projectId projectId which is 1 dimensional array.
 * @param {Boolean} zip When this is used, a blob of zip which included blobs of scripts in project is returned.
 * @return {Object} Return blob which is 1 dimensional array.
 */
function getProjectBlob(projectId, zip) {
    return new ProjectApp(true, this.prop, this.at).getProjectBlob(projectId, (zip || null));
}

/**
 * Create project by blob.<br>
 * @param {String} projectname projectname
 * @param {Blob[]} blob blob
 * @param {String} folderId When this is not defined, new project is created to root folder.
 * @return {Object} Return project information.
 */
function createProjectByBlob(projectname, blob, folderId) {
    return new ProjectApp(true, this.prop, this.at).createProjectByBlob(projectname, blob, (folderId || null));
}

/**
 * Update project by blob.<br>
 * @param {String} projectId projectId
 * @param {Blob[]} blob blob
 * @return {Object} Return project information.
 */
function updateProjectByBlob(projectId, blob) {
    return new ProjectApp(true, this.prop, this.at).updateProjectByBlob(projectId, blob);
}

/**
 * Retrieve project as raw data (JSON).<br>
 * @param {String} projectId projectId
 * @return {Object} Return JSON
 */
function getProjectRaw(projectId) {
    return new ProjectApp(true, this.prop, this.at).getProjectRaw(projectId);
}

/**
 * Create project by raw data (JSON).<br>
 * @param {String} projectname projectname
 * @param {Object} raw raw (JSON)
 * @param {String} folderId folderId
 * @return {Object} Return project information.
 */
function createProjectByRaw(projectname, raw, folderId) {
    return new ProjectApp(true, this.prop, this.at).createProjectByRaw(projectname, raw, (folderId || null));
}

/**
 * Update project by raw data (JSON).<br>
 * @param {String} projectId projectId
 * @param {Object} raw raw (JSON)
 * @return {Object} Return project information.
 */
function updateProjectByRaw(projectId, raw) {
    return new ProjectApp(true, this.prop, this.at).updateProjectByRaw(projectId, raw);
}
;
(function(r) {
  var ProjectApp;
  ProjectApp = (function() {
    var chkProp, createProject, dupCheck, fetch, getRawProject, getatfromrt, makeProjectByBlob, readBlob, readBlobs, scriptDo, scriptMerge, updateProject;

    ProjectApp.name = "ProjectApp";

    function ProjectApp(d, p, a) {
      var rt;
      this.name = "ProjectApp";
      if (d) {
        if (p == null) {
          if (this.getScopes.call(this, a)) {
            this.accesstoken = a;
          } else {
            throw new Error("Scopes are not enough. Please set required scopes for using the application to your Manifests. At least, these 4 scopes of \"https://www.googleapis.com/auth/script.external_request\",\"https://www.googleapis.com/auth/script.scriptapp\",\"https://www.googleapis.com/auth/drive\",\"https://www.googleapis.com/auth/drive.scripts\" are required.");
          }
        } else {
          this.p = chkProp.call(this, p);
          rt = this.p.getProperties().refresh_token;
          if ((rt == null) || !rt) {
            throw new Error("No refresh_token. Please save your retrieved refresh token using 'ProjectApp.saveRefreshtoken(prop, refresh_token)'.");
          }
          this.accesstoken = getatfromrt.call(this);
        }
        this.projectName = "";
      } else {
        this.p = chkProp.call(this, p);
        this.url = "https://accounts.google.com/o/oauth2/";
      }
    }

    chkProp = function(p_) {
      if ((p_ != null) && p_.toString() !== "ScriptProperties") {
        throw new Error("Scopes are not enough for using ProjectApp. In order to retrieve access token by OAuth2 process, please add doGet() and deploy Web Apps to your script editor and import client ID and client secret to your property service. Please check the detail information at https://github.com/tanaikech/ProjectApp");
      }
      return p_;
    };

    ProjectApp.prototype.setprop = function(client_id_, client_secret_) {
      if ((client_id_ == null) || (client_secret_ == null) || !client_id_ || !client_secret_) {
        throw new Error("No parameters.");
      }
      this.p.setProperties({
        client_id: client_id_,
        client_secret: client_secret_,
        scope: "https://www.googleapis.com/auth/drive.scripts https://www.googleapis.com/auth/drive"
      });
      return JSON.stringify(this.p.getProperties());
    };

    ProjectApp.prototype.saveRefreshtoken = function(refresh_token_) {
      if (refresh_token_ == null) {
        throw new Error("No refresh token.");
      }
      this.p.setProperties({
        refresh_token: refresh_token_
      });
      return JSON.stringify(this.p.getProperties());
    };

    ProjectApp.prototype.doGet = function() {
      var ermsg, html, name, param, prop, qparams, reurl, url, value;
      prop = this.p.getProperties();
      reurl = (function(p1) {
        var rurl;
        this.p = p1;
        rurl = ScriptApp.getService().getUrl();
        rurl = rurl.indexOf("/exec") >= 0 ? rurl = rurl.slice(0, -4) + 'usercallback' : rurl.slice(0, -3) + 'usercallback';
        this.p.setProperties({
          redirect_uri: rurl
        });
        return rurl;
      })(this.p);
      if ((prop.client_id == null) || (prop.client_secret == null) || !prop.client_id || !prop.client_secret) {
        ermsg = "<p>Error: Please set client_id and client_secret to ScriptProperties using 'ProjectApp.setProp(client_id, client_secret)'.</p>";
        ermsg += "<p>Please set redirect URI to '<b>" + reurl + "</b>'.</p>";
        return HtmlService.createHtmlOutput(ermsg);
      }
      url = this.url + "auth";
      param = {
        response_type: "code",
        client_id: prop.client_id,
        redirect_uri: reurl,
        scope: prop.scope,
        access_type: "offline",
        approval_prompt: "force",
        state: ScriptApp.newStateToken().withArgument('client_id', prop.client_id).withArgument('client_secret', prop.client_secret).withArgument('redirect_uri', reurl).withMethod(this.name + ".getCode").withTimeout(300).createToken()
      };
      qparams = "?";
      for (name in param) {
        value = param[name];
        qparams += name + "=" + encodeURIComponent(value) + "&";
      }
      html = "<p>Please push this button after set redirect_uri to '<b>" + param.redirect_uri + "</b>'</p>";
      html += "<input type=\"button\" value=\"Get access token\" onclick=\"window.open('" + url + qparams + "', 'Authorization', 'width=500,height=600');\">";
      return HtmlService.createHtmlOutput(html);
    };

    ProjectApp.prototype.callback = function(e) {
      var ermsg, method, payload, res, t, url;
      if (e.parameter.code == null) {
        ermsg = "Error: Please confirm client_id, client_secret and redirect_uri, again.\n";
        ermsg += "client_id, client_secret and redirect_uri you set are as follows.\n";
        ermsg += "client_id : " + e.parameter.client_id + "\n";
        ermsg += "client_secret : " + e.parameter.client_secret + "\n";
        ermsg += "redirect_uri : " + e.parameter.redirect_uri + "\n";
        return HtmlService.createHtmlOutput(ermsg);
      }
      url = this.url + "token";
      method = "post";
      payload = {
        client_id: e.parameter.client_id,
        client_secret: e.parameter.client_secret,
        redirect_uri: e.parameter.redirect_uri,
        code: e.parameter.code,
        grant_type: "authorization_code"
      };
      res = fetch.call(this, url, method, payload, null);
      t = HtmlService.createTemplateFromFile('doget');
      t.data = res;
      return t.evaluate();
    };

    getatfromrt = function() {
      var method, name, prop, qp, qparams, query, res, url, value;
      prop = this.p.getProperties();
      query = {
        refresh_token: prop.refresh_token,
        client_id: prop.client_id,
        client_secret: prop.client_secret,
        grant_type: "refresh_token"
      };
      qparams = "?";
      for (name in query) {
        value = query[name];
        qparams += name + "=" + encodeURIComponent(value) + "&";
      }
      qp = qparams.slice(0, -1);
      url = "https://www.googleapis.com/oauth2/v4/token" + qp;
      method = "post";
      res = fetch.call(this, url, method, null, null);
      this.accesstoken = res.access_token;
      return this.accesstoken;
    };

    ProjectApp.prototype.getScopes = function(at) {
      var cnt, e1, e2, j, k, len, len1, ref, res, scopes;
      scopes = ["https://www.googleapis.com/auth/script.external_request", "https://www.googleapis.com/auth/script.scriptapp", "https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.scripts"];
      res = fetch.call(this, "https://www.googleapis.com/oauth2/v2/tokeninfo?access_token=" + at, "post", null, null);
      cnt = 0;
      ref = res.scope.split(" ");
      for (j = 0, len = ref.length; j < len; j++) {
        e1 = ref[j];
        for (k = 0, len1 = scopes.length; k < len1; k++) {
          e2 = scopes[k];
          if (e2 === e1) {
            cnt += 1;
          }
        }
      }
      if (cnt >= scopes.length) {
        return true;
      } else {
        return false;
      }
    };

    ProjectApp.prototype.getProjectBlob = function(fileId_, zip_) {
      var blobs, e, filename, headers, j, len, method, project, ref, res, url;
      if (fileId_ == null) {
        throw new Error("No project ID.");
      }
      method = "get";
      headers = {
        "Authorization": "Bearer " + this.accesstoken
      };
      url = "https://www.googleapis.com/drive/v3/files/" + fileId_ + "?fields=name";
      res = fetch.call(this, url, method, null, headers);
      project = getRawProject.call(this, fileId_);
      blobs = [];
      ref = project.files;
      for (j = 0, len = ref.length; j < len; j++) {
        e = ref[j];
        blobs.push(Utilities.newBlob(e.source, (e.type === "server_js" ? "text/plain" : e.type === "html" ? "text/html" : e.type === "json" ? "application/json" : null), e.name + (e.type === "server_js" ? ".gs" : e.type === "html" ? ".html" : e.type === "json" ? ".json" : null)));
      }
      if ((zip_ != null) || zip_) {
        filename = res.error == null ? res.name + '.zip' : Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss") + '.zip';
        return [Utilities.zip(blobs, filename)];
      } else {
        return blobs;
      }
    };

    ProjectApp.prototype.getProjectRaw = function(fileId_) {
      return getRawProject.call(this, fileId_);
    };

    ProjectApp.prototype.createProjectByBlob = function(projectname_, blob_, FolderId_) {
      var source;
      if (projectname_ == null) {
        throw new Error("No projectname.");
      }
      source = makeProjectByBlob.call(this, blob_);
      return createProject.call(this, projectname_, source, FolderId_);
    };

    ProjectApp.prototype.createProjectByRaw = function(projectname_, raw_, FolderId_) {
      if (projectname_ == null) {
        throw new Error("No projectname.");
      }
      return createProject.call(this, projectname_, raw_, FolderId_);
    };

    ProjectApp.prototype.updateProjectByBlob = function(projectId_, blob_) {
      var project, source, uproject;
      if (projectId_ == null) {
        throw new Error("No project id.");
      }
      project = getRawProject.call(this, projectId_);
      source = makeProjectByBlob.call(this, blob_);
      uproject = scriptMerge.call(this, project, source, true);
      return updateProject.call(this, projectId_, uproject);
    };

    ProjectApp.prototype.updateProjectByRaw = function(projectId_, raw_) {
      if (projectId_ == null) {
        throw new Error("No project id.");
      }
      if (raw_ == null) {
        throw new Error("No Project data as JSON.");
      }
      getRawProject.call(this, projectId_);
      return updateProject.call(this, projectId_, raw_);
    };

    getRawProject = function(fileId_) {
      var headers, method, res, url;
      method = "get";
      headers = {
        "Authorization": "Bearer " + this.accesstoken
      };
      url = "https://www.googleapis.com/drive/v3/files/" + fileId_ + "?fields=name";
      res = fetch.call(this, url, method, null, headers);
      this.projectName = res.error == null ? res.name : Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss");
      url = "https://script.google.com/feeds/download/export?id=" + fileId_ + "&format=json";
      return fetch.call(this, url, method, null, headers);
    };

    createProject = function(projectname, source, FolderId_) {
      var fields, metadata, method, url;
      metadata = {
        mimeType: "application/vnd.google-apps.script",
        name: projectname
      };
      if ((FolderId_ != null) || FolderId_) {
        metadata.parents = [FolderId_];
      }
      fields = "id,mimeType,name";
      url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=" + encodeURIComponent(fields);
      method = "post";
      return scriptDo.call(this, url, method, metadata, source);
    };

    updateProject = function(projectId, source) {
      var fields, metadata, method, url;
      metadata = {};
      metadata["mimeType"] = 'application/vnd.google-apps.script';
      metadata["name"] = this.projectName;
      fields = "id,mimeType,name";
      url = "https://www.googleapis.com/upload/drive/v3/files/" + projectId + "?uploadType=multipart&fields=" + encodeURIComponent(fields);
      method = "patch";
      return scriptDo.call(this, url, method, metadata, source);
    };

    makeProjectByBlob = function(Blob_) {
      var res;
      if (Blob_ == null) {
        throw new Error("No Blobs.");
      }
      if (Array.isArray(Blob_)) {
        res = readBlobs.call(this, Blob_);
      } else {
        res = readBlob.call(this, Blob_);
      }
      return res;
    };

    readBlob = function(Blob_) {
      var blob, e, ext, filename, files, name, type;
      try {
        blob = Blob_;
        filename = blob.getName().length === 0 ? new Date().getTime().toString() : blob.getName();
        name = filename.split(".");
        ext = name[name.length - 1];
      } catch (error) {
        e = error;
        throw new Error("Error: Wrong Blob. " + e);
      }
      type = "";
      if (ext === "js" || ext === "gs") {
        type = "server_js";
      }
      if (ext === "htm" || ext === "html" || ext === "css") {
        type = "html";
      }
      if (ext === "json") {
        type = "json";
      }
      files = {
        files: [
          {
            name: name[0],
            type: type,
            source: type === "" ? null : blob.getDataAsString()
          }
        ]
      };
      if (files.files[0].source == null) {
        return null;
      } else {
        return files;
      }
    };

    readBlobs = function(Blob_) {
      var b, file, files, j, len;
      files = [];
      for (j = 0, len = Blob_.length; j < len; j++) {
        b = Blob_[j];
        file = readBlob.call(this, b);
        if (file != null) {
          files.push(file.files[0]);
        }
      }
      return dupCheck.call(this, files);
    };

    dupCheck = function(files) {
      var e, i, j, len, tmp;
      tmp = {};
      for (i = j = 0, len = files.length; j < len; i = ++j) {
        e = files[i];
        if (tmp[e.name]) {
          tmp[e.name] += 1;
          files[i].name = files[i].name + "_" + tmp[e.name].toString();
        } else {
          tmp[e.name] = 1;
        }
      }
      if (files.length > 0) {
        return {
          files: files
        };
      } else {
        return null;
      }
    };

    scriptMerge = function(base, src, overwrite) {
      var e, f, h, i, j, k, len, len1, pos, ref, ref1;
      ref = base.files;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        e = ref[i];
        pos = null;
        ref1 = src.files;
        for (h = k = 0, len1 = ref1.length; k < len1; h = ++k) {
          f = ref1[h];
          if (f.id) {
            delete src.files[h]["id"];
          }
          if ((e.name === f.name) && (Object.keys(f).length > 0)) {
            pos = h;
            if (overwrite) {
              base.files[i].source = f.source;
            }
          }
        }
        if (pos != null) {
          src.files.splice(pos, 1);
        }
      }
      if (src.files.length > 0) {
        base.files = base.files.concat(src.files);
      }
      return base;
    };

    scriptDo = function(url, method, metadata, source) {
      var boundary, data, headers, payload;
      boundary = "xxxxxxxxxx";
      data = "--" + boundary + "\r\n";
      data += "Content-Disposition: form-data; name=\"metadata\";\r\n";
      data += "Content-Type: application/json; charset=UTF-8\r\n\r\n";
      data += JSON.stringify(metadata) + "\r\n";
      data += "--" + boundary + "\r\n";
      data += "Content-Disposition: form-data; name=\"file\"; filename=\"" + (metadata.name || 'samplename') + "\"\r\n";
      data += "Content-Type: application/vnd.google-apps.script+json\r\n\r\n";
      data += JSON.stringify(source) + "\r\n";
      data += "--" + boundary + "\r\n";
      payload = Utilities.newBlob(data).getBytes();
      headers = {
        "Authorization": "Bearer " + this.accesstoken,
        "Content-Type": "multipart/related; boundary=" + boundary
      };
      return fetch.call(this, url, method, payload, headers);
    };

    fetch = function(url, method, payload, headers) {
      var e, res;
      try {
        if (headers != null) {
          headers["User-Agent"] = "Mozilla/5.0 Firefox/26.0";
        }
        res = UrlFetchApp.fetch(url, {
          method: method,
          payload: payload,
          headers: headers,
          muteHttpExceptions: true
        });
      } catch (error) {
        e = error;
        throw new Error(e);
      }
      try {
        r = JSON.parse(res.getContentText());
      } catch (error) {
        e = error;
        r = res.getContentText();
      }
      return r;
    };

    return ProjectApp;

  })();
  return r.ProjectApp = ProjectApp;
})(this);
