# DrsBee Client Demo

This project is intended to serve as a test for the usage of drsbee.client package

## Usage

After cloning this project you have to run this commmand to install the dependencies from **package.json**:

```
npm install
```

Then you can run:
```
node index.js
```
This file will use **drsbee.client** to make a prescription.

**Note:** To use **drsbee.client** lib on another project, it is important to see that the lib is included on the **package.json** like this:

```
{
	... 
	"dependencies": {
		"drsbee.client": "http://repo.apololab.com/repository/apolo-npm-public/drsbee.client/-/drsbee.client-1.0.4.tgz"
	}
	...
}
```


## License
[MIT](https://choosealicense.com/licenses/mit/)