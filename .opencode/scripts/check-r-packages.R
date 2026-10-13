# Checks the R packages needed for Prof. Enneking's part of the module and,
# with the argument "install", installs the missing ones into the user library.
#
#   Rscript .opencode/scripts/check-r-packages.R            check only
#   Rscript .opencode/scripts/check-r-packages.R install    check and install what is missing
#
# This list is the single source. kurs/anleitungen/r-pakete.md mirrors it for
# the students; keep both in line when a package is added.
packages <- c(
  "tidyverse", "psych", "stats", "car", "sjmisc", "janitor", "ufs",
  "emmeans", "FactoMineR", "dplyr", "purrr", "REdaS", "GPArotation"
)

repos <- "https://cloud.r-project.org"

# Looks at the library folders without loading anything, so the check is fast.
is_installed <- function(pkg) nzchar(system.file(package = pkg))

# For a package that CRAN no longer offers (ufs was archived on 2026-08-28):
# installs its newest archived version. The dependencies come from CRAN as
# ready-made binaries, so no compiler is needed; the archived package itself
# is plain R code and installs from source without one.
install_from_archive <- function(pkg, lib) {
  base_url <- paste0(repos, "/src/contrib/Archive/", pkg, "/")
  index <- tryCatch(readLines(base_url, warn = FALSE), error = function(e) character())
  files <- unique(regmatches(index, regexpr(paste0(pkg, "_[0-9][0-9.-]*[.]tar[.]gz"), index)))
  if (length(files) == 0) return(FALSE)

  # The listing is sorted by name, not by version, so sort by version number.
  versions <- sub("[.]tar[.]gz$", "", sub(paste0("^", pkg, "_"), "", files))
  newest <- files[order(package_version(versions), decreasing = TRUE)][1]
  tarball <- file.path(tempdir(), newest)
  download.file(paste0(base_url, newest), tarball, mode = "wb", quiet = TRUE)

  untar(tarball, files = paste0(pkg, "/DESCRIPTION"), exdir = tempdir())
  fields <- read.dcf(file.path(tempdir(), pkg, "DESCRIPTION"), fields = c("Depends", "Imports"))
  deps <- trimws(sub("[(].*$", "", strsplit(paste(na.omit(as.vector(fields)), collapse = ","), ",")[[1]]))
  deps <- setdiff(deps[nzchar(deps)], c("R", rownames(installed.packages(priority = "base"))))
  deps <- deps[!vapply(deps, is_installed, logical(1))]
  if (length(deps) > 0) install.packages(deps, repos = repos, lib = lib)

  install.packages(tarball, repos = NULL, type = "source", lib = lib)
  is_installed(pkg)
}

args <- commandArgs(trailingOnly = TRUE)
install <- "install" %in% args

cat("R", as.character(getRversion()), "\n")
missing <- packages[!vapply(packages, is_installed, logical(1))]

if (length(missing) == 0) {
  cat("Alle", length(packages), "Pakete sind vorhanden.\n")
  quit(status = 0)
}

cat("Vorhanden:", paste(setdiff(packages, missing), collapse = ", "), "\n")
cat("Fehlt:", paste(missing, collapse = ", "), "\n")

if (!install) {
  quit(status = 1)
}

# Windows and macOS usually have a read-only system library. Installing into the
# personal library works without administrator rights and without a prompt,
# which Rscript cannot answer.
user_lib <- Sys.getenv("R_LIBS_USER")
if (nzchar(user_lib)) {
  dir.create(user_lib, recursive = TRUE, showWarnings = FALSE)
  .libPaths(c(user_lib, .libPaths()))
}
lib <- .libPaths()[1]
cat("Installiere nach", lib, "\n")

on_cran <- tryCatch(
  rownames(available.packages(repos = repos)),
  error = function(e) character()
)
from_cran <- intersect(missing, on_cran)
not_on_cran <- setdiff(missing, on_cran)

if (length(from_cran) > 0) {
  install.packages(from_cran, repos = repos, lib = lib)
}
for (pkg in not_on_cran) {
  cat("Das Paket", pkg, "ist nicht mehr auf CRAN; installiere die neueste archivierte Fassung.\n")
  install_from_archive(pkg, lib)
}

still_missing <- missing[!vapply(missing, is_installed, logical(1))]
if (length(still_missing) == 0) {
  if (length(not_on_cran) > 0) {
    cat("Aus dem CRAN-Archiv installiert:", paste(not_on_cran, collapse = ", "), "\n")
  }
  cat("Fertig: Alle", length(packages), "Pakete sind vorhanden.\n")
  quit(status = 0)
}
cat("Nicht installiert werden konnte:", paste(still_missing, collapse = ", "), "\n")
quit(status = 1)
