core: "DRUSH_CORE"

api: 2

includes:
  - "APP-NAME.make"

projects:
  custom_profile:
    type: "profile"
    subdir: "."
    download:
      type: "copy"
      url: "file://./drupal/profiles/custom_profile"