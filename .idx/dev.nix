{pkgs}: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
  ];
  idx.extensions = [
    "angular.ng-template"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "s"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
          "--disable-host-check"
        ];
        manager = "web";
      };
    };
  };
  idx.workspace.onCreate = {
    ng-install = "npm install";
    functions-install = "env -C ./functions npm i";
  };
}