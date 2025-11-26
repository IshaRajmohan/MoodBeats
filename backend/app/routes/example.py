from flask import Blueprint, jsonify
bp=Blueprint('example',__name__, url_prefix='/api')
@bp.route('/example',methods=['GET'])
def get_example():
    return jsonify({'message':'backend working'})
