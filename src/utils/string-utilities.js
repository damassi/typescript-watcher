/**
 * Various string utilities
 * 
 * @author Christopher Pappas | github.com/damassi
 * @since 11.24.12
 */


//--------------------------------------
//+ PUBLIC INTERFACE
//--------------------------------------

/**
 * Extracts the file-name from the path
 * @param  {String} path the full path
 * 
 * @return {String}      the file-name
 */
exports.getFileName = function( path ) {
	return path.match(/[^\/]*$/)[0];
}

/**
 * Extracts the file-path from the path
 * @param  {String} path the full file-path
 * 
 * @return {String}      the file path
 */
exports.getFilePath = function( path ) {
	return path.replace(/[^\/]*$/, "");
}

/**
 * Filters file-system files for only .ts related
 * @param  {String} path the file path
 * 
 * @return {String}      valid typescript file-paths
 */
exports.filter = function( path ) {
	// filter only typescript files
	if( path.match(/^.*\.(ts)$/i))
		// filter out interfaces and type definitions
		if( !path.match( /\.d\.ts/ ))
			return path;

	return '';
}